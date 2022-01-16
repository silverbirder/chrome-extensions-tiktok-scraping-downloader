# server
## Usage
```
$ npm install
$ cp .env.sample .env
# edit .env file to store to Google Cloud Firestore.
$ npm start
```

## Misc

```
$ gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/storer
$ gcloud run deploy --image gcr.io/$(gcloud config get-value project)/storer
```
