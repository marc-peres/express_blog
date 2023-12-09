import express, { Request, Response } from 'express'

export const app = express();

app.use(express.json());

const AvailableResolutionsType =  ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']


type VideosDbType =  {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: typeof AvailableResolutionsType;
}

let videosDb: VideosDbType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-12-08T14:00:56.884Z",
        publicationDate: "2023-12-08T14:00:56.884Z",
        availableResolutions: [
            "P144", 'P240'
        ]
    }
];

type PostVideoByIdType<I> = Request<I, {}, {}, {}>
type PostVideoType<I> = Request<{}, {}, I, {}>
type PutVideoType<P, I> = Request<P, {}, I, {}>
type PostVideItemType = {
    title: string;
    author: string;
    availableResolutions?: typeof AvailableResolutionsType;
}
type ErrorMessage = {
    message: string;
    field: string;
}
type ErrorType = {
    errorsMessages: ErrorMessage[];
}
type PutVideoItemType = {
    title: string;
    author: string;
    availableResolutions: typeof AvailableResolutionsType;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    publicationDate: string;
}
type IdParamType = { id: string };

app.get('/', (req: Request, res: Response) => {
    res.send('home page');
});

app.get('/videos', (req: Request, res: Response) => {
    res.send(videosDb);
});

app.get('/videos/:id', (req: PostVideoByIdType<IdParamType>, res: Response) => {
    const id = +req.params.id

    const requestedVideo = videosDb.find(i => i.id === id);

    if (!requestedVideo) {
        res.sendStatus(404);
        return;
    }

    res.send(requestedVideo);
});

app.post('/videos', (req: PostVideoType<PostVideItemType>, res: Response) => {
    let {title, author, availableResolutions} = req.body;
    const errors: ErrorType = {
        errorsMessages: Array(0),
    };

    if (!title || typeof title !== "string" || !title.trim() || title.length > 40) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid title',
            field: 'title'
        }
    }

    if (!author || typeof author !== "string" || !author.trim() || author.length > 20) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid author',
            field: 'author'
        }
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutionsType.includes(r)) {
                errors.errorsMessages[errors.errorsMessages.length] = {
                    message: 'invalid availableResolutions',
                    field: 'availableResolutions'
                }
            }
        })
    } else {
        availableResolutions = Array(AvailableResolutionsType[0]);
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors.errorsMessages)
        return;
    }

    const createdAt = new Date();
    const publicationDate = new Date();

    const newVideo: VideosDbType = {
        id: +createdAt,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        author,
        title,
        minAgeRestriction: null,
        canBeDownloaded: false,
        availableResolutions,
    };

    videosDb.push(newVideo);

    res.status(201).send(newVideo)
});

app.put('/videos/:id', (req: PutVideoType<IdParamType, PutVideoItemType>, res: Response) => {
    let {title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded} = req.body;

    const errors: ErrorType = {
        errorsMessages: Array(0),
    };

    if (!title || typeof title !== "string" || !title.trim() || title.length > 40) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid title',
            field: 'title'
        }
    }

    if (!author || typeof author !== "string" || !author.trim() || author.length > 20) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid author',
            field: 'author'
        }
    }

    const id = +req.params.id

    let indexOfRequestedVideo = -1;
    const requestedVideo = videosDb.find((item, index) => {
        if (item.id === id) {
            indexOfRequestedVideo = index;
        }
        return item.id === id;
    });

    if (!requestedVideo) {
        res.sendStatus(404);
        return;
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutionsType.includes(r)) {
                errors.errorsMessages[errors.errorsMessages.length] = {
                    message: 'invalid availableResolutions',
                    field: 'availableResolutions'
                }
            }
        })
    } else {
        availableResolutions = Array(AvailableResolutionsType[0]);
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors.errorsMessages)
        return;
    }

    const parsedDate = new Date(Date.parse(publicationDate));

    if (!publicationDate || !parsedDate || parsedDate.toISOString() !== publicationDate) {
        publicationDate = new Date().toISOString()
    }

    if (!minAgeRestriction || minAgeRestriction !== minAgeRestriction || typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18) {
        minAgeRestriction = null;
    }

    if (typeof canBeDownloaded !== 'boolean') {
        canBeDownloaded = false;
    }

    videosDb[indexOfRequestedVideo].title = title;
    videosDb[indexOfRequestedVideo].author = author;
    videosDb[indexOfRequestedVideo].availableResolutions = availableResolutions;
    videosDb[indexOfRequestedVideo].publicationDate = publicationDate;
    videosDb[indexOfRequestedVideo].canBeDownloaded = canBeDownloaded;

    res.sendStatus(204)
});

app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id

    const requestedVideo = videosDb.find(i => i.id === id);

    if (!requestedVideo) {
        res.sendStatus(404);
        return;
    }

    videosDb = videosDb.filter(i => i.id !== requestedVideo.id);
    res.sendStatus(204);
});