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

const videosDb: VideosDbType[] = [
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


app.get('/', (req: Request, res: Response) => {
    res.send('home page');
});

app.get('/videos', (req: Request, res: Response) => {
    res.send(videosDb);
});

app.get('/videos/:id', (req: PostVideoByIdType<{ id: string }>, res: Response) => {
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
        availableResolutions = Array(0);
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