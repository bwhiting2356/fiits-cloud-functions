# Fiits Cloud Functions

## Data Pipeline Cron Job

This function is tied to a GCP Cloud Scheduler job and GCP PubSub topic which will call it every 10 minutes. It will pull the latest data from `https://gbfs.baywheels.com/gbfs/en/station_status.json`, put it in a GCP BigQuery table to be used later for machine learning in GCP AutoML Tables (see [this repo](https://github.com/bwhiting2356/fiits-inventory-prediction))

## New User Create Profile

This function is to create a new user profile in the backend database every time there is a new signup.