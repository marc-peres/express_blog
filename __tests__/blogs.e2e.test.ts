import {app, HTTP_STATUSES, videosDb} from "../src/settings";
import request = require('supertest')
describe('videos api tests', () => {

    afterEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204);
        expect(videosDb).toBeInstanceOf(Array);
        expect(videosDb).toHaveLength(0);
    })

    it('should return 200 on home page', async () => {
        await request(app)
                .get('/')
                .expect(HTTP_STATUSES.OK_200, 'home page');
    });

    it('should return 200 with videos list', async () => {
        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, videosDb);
    });

    it('shouldn\'t create new video return 400', async () => {
        await request(app)
            .post('/videos')
            .send({ title: '', author: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'invalid title',
                        field: 'title'
                    },
                    {
                        message: 'invalid author',
                        field: 'author'
                    },
                ]
            });

        await request(app)
            .post('/videos')
            .send({ title: 'asdasdasdasdasdasdasdasdasdasdasdasd12312', author: 'asdasdasdasdasdasdaas' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'invalid title',
                        field: 'title'
                    },
                    {
                        message: 'invalid author',
                        field: 'author'
                    },
                ]
            });

        await request(app)
            .post('/videos')
            .send({ title: 'new video', author: 'any author', availableResolutions: [ '1', '2', '3', '3' ] })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'invalid availableResolutions',
                        field: 'availableResolutions'
                    }
                ]
            });
    });

    it('should create new video with 201 without availableResolutions', async () => {
        const response = await request(app)
            .post('/videos')
            .send({ title: 'new video', author: 'any author' })
            .expect(HTTP_STATUSES.CREATED_201);
        const createdVideo = response.body;
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            author: 'any author',
            title: 'new video',
            minAgeRestriction: null,
            canBeDownloaded: false,
            availableResolutions: [ 'P144' ],
        })
    });


    it('should create new video with 201 with correct availableResolutions', async () => {
        const response = await request(app)
            .post('/videos')
            .send({ title: 'new video', author: 'any author', availableResolutions: [ 'P144', 'P240', 'P360', 'P480' ] })
            .expect(HTTP_STATUSES.CREATED_201);
        const createdVideo = response.body;
        expect(createdVideo.availableResolutions).toEqual([ 'P144', 'P240', 'P360', 'P480' ])
    });

    it('shouldn\'t change video and return 400', async () => {

        await request(app)
            .put(`/videos/0`)
            .send({ title: '', author: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'invalid title',
                        field: 'title'
                    },
                    {
                        message: 'invalid author',
                        field: 'author'
                    },
                ]
            });

        await request(app)
            .put(`/videos/0`)
            .send({ title: 'asdasdasdasdasdasdasdasdasdasdasdasd12312', author: 'asdasdasdasdasdasdaas' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'invalid title',
                        field: 'title'
                    },
                    {
                        message: 'invalid author',
                        field: 'author'
                    },
                ]
            });

        await request(app)
            .put(`/videos/0`)
            .send({ title: 'new video', author: 'any author', availableResolutions: [ '1', '2', '3', '3' ] })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'invalid availableResolutions',
                        field: 'availableResolutions'
                    }
                ]
            });
    });

    it('shouldn\'t found video and return 404', async () => {
        await request(app)
            .put('/videos/123')
            .send({ title: 'new video', author: 'any author' })
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('shouldn correct change video and return 204', async () => {
        const { body: createdVideo } = await request(app)
            .post('/videos')
            .send({ title: 'video title', author: 'video author' })
            .expect(HTTP_STATUSES.CREATED_201);

        const createdId = createdVideo.id;
        const publicationDate = new Date().toISOString()
        const minAgeRestriction = 15;
        const canBeDownloaded = true;

        await request(app)
            .put(`/videos/${createdId}`)
            .send({
                title: 'new video title',
                author: 'new video author',
                availableResolutions: [ 'P240', 'P360' ],
                publicationDate,
                minAgeRestriction,
                canBeDownloaded,
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204);


        const { body: changedVideo } = await request(app)
            .get(`/videos/${createdId}`)
            .expect(HTTP_STATUSES.OK_200);

        expect(changedVideo).toEqual({
            id: createdId,
            createdAt: createdVideo.createdAt,
            publicationDate: publicationDate,
            author: 'new video author',
            title: 'new video title',
            minAgeRestriction: 15,
            canBeDownloaded: true,
            availableResolutions: [ 'P240', 'P360' ],
        })
    });

});
