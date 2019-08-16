#!/usr/bin/env bash

set -o errexit

projectDir=$(cd "$(dirname "${0}")" && cd ../ && pwd)
# shellcheck source=release.sh
source "${projectDir}/etc/release.sh" || source  ./release.sh

createMeta "local"

ng serve --disable-host-check
