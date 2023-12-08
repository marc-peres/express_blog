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
            "P144"
        ]
    }
];

app.use('/videos', (req: Request, res: Response) => {
    res.send(videosDb);
});