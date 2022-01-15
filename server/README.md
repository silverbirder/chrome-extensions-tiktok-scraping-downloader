```
$ gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/storer
$ gcloud run deploy --image gcr.io/$(gcloud config get-value project)/storer
```
