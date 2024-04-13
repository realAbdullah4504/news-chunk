import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from scraping_script import main

sched = BlockingScheduler()

@sched.scheduled_job('interval', hours=1, next_run_time=datetime.datetime.now())
def timed_job():
    print('This job is run every 1 hour.')
    main()

sched.start()
