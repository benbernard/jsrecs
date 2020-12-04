## Current list

1. Support json5
2. precommit checks
3. Support multi-line single documents -> parser?
4. Write tests for command and command args parsing
5. Startup improvements (below)


## Startup improvements

Spawn a server with the node cluster api.
Spin up and down workers as needed, trying to keep a buffer in memory

Small bash script makes this clearer:

```
INSTANCE_PORT=$(curl localhost:$JSRECS_HUB_PORT/spawn)
curl localhost:$INSTANCE_PORT -d $ARGS_JSON
```

This is separate from recs-chain improvements

Could do this with only babel, that gets the largest offenders out of the
initial startup and keeps the workers lean and mean
