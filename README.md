# Data Pipeline Cron Job

This project is tied to a GCP Cloud Scheduler job and GCP PubSub topic which will call this function every 10 minutes. It will pull the latest data from `https://gbfs.baywheels.com/gbfs/en/station_status.json`, put it in a GCP BigQuery table to be used later for machine learning in GCP AutoML Tables, and predict the future intentory using the time of day and station name.
