#!/usr/bin/env bash

projectDir=$(cd "$(dirname "${0}")" && cd ../ && pwd)

VCSRef() {
	printf "%s" "$(git log -n 1 --pretty=format:%H)"
}

repo() {
	printf "https://github.com/opsway/nodal" # TODO parse $(git config --get remote.origin.url)"
}

version() {
	printf "%s" "$(git describe --tags --always --dirty)"
}

release() {
	printf "%s" "$(TZ=UTC date +'%y%m%d.%H')"
}

releaseNumber() {
	printf "%s-%s" "$(release)" "$(version)"
}

createMeta() {
  number="${1:-"$(releaseNumber)"}"
	printf "export const meta = { releaseNumber: '%s', repo: '%s' };" "${number}" "$(repo)" | tee "${projectDir}/src/app/app.meta.ts"
}


