# network-sniffer

Simple network sniffer. Looks for and records traffic on specified IP/port.

### Usage

To sniff for traffic on your internal IP, port 8080, simply run `npm start`. This will log traffic to `src/logs/current.log`.

For more tailored control, use any combination of the following command line options:

```bash
# specify IP to listen on
node sniff.js -h 127.0.0.1

# specify port to listen on
node sniff.js -p 8888

# suppress traffic logs to STDOUT
node sniff.js --noprint

# save timestamed version of log in addition to current.log
node sniff.js --save
```

### Monitor traffic via web interface

To see a running log of the traffic in your browser while the sniffer is listening, visit `http://[HOST]:[PORT]/app/` in your browser, where `[HOST]` and `[PORT]` are the host and port that you are listening on. The page will automatically reload the log every second, so no need to refresh!
