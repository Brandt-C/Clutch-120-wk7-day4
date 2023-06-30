def unique(string):
    key = {}
    ans = -1
    for s in string:
        if s not in key:
            key[s] = 1
        else:
            key[s] += 1
    for k, v in key.items():
        if v == 1:
            ans = v
    if ans != -1:
        return string.index(ans)
    return -1