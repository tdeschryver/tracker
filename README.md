# Tracker
Small command line utility for task tracking.

## Usage:
```bash
> track [command]
> track [report]
> trackl
```

## Commands:
### start [taskname]
This will also stop the currently running task.
```bash
> track start foo
```

### stop
```bash
> track stop
```

## Reports:
### Check which task is currently running with **status**
```bash
> track status
# foo been running for 11m36s
```

### Get a list of all tasks and their corresponding durations with **summary** or **summary_today**
```bash
> track summary
# foo: 11m36s
# bar: 08m05s
```

### Get a list of all tasks and their start and stop times with **timesheet** or **timesheet_today**
```bash
> track summary
# [2017-08-23 10:43:17 - 2017-08-23 10:47:51]: foo
# [2017-08-23 10:47:51 - 2017-08-23 10:55:56]: bar
# [2017-08-23 11:21:07 - 2017-08-23 11:28:09]: foo
```

## Interactive wizard
```bash
> trackl
```