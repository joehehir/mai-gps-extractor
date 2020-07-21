#!/bin/bash
set -eu

# define directory
DIST_DIR="$(pwd)/dist"

# define regular expressions
declare -a TARGET_ENTRYPOINT_SUBSTITUTION=(
   "extractor\.([a-f0-9]{8,32})\.js || index\.[a-f0-9]{8,32}\.js || \(new Worker(\\\"extractor\)\(\.js\\\",\)"
   # ...
)

# stdout
NL="\n"; IDENT=$(printf "%*s" 4 " "); COLOR_RED="\033[0;31m"; COLOR_GREEN="\033[0;32m"; COLOR_RESET="\033[0m"; WEIGHT_BOLD=$(tput bold); WEIGHT_NORMAL=$(tput sgr0)
MSG_NOT_FOUND="${NL}${IDENT}${COLOR_RED}ERR!${COLOR_RESET} ${WEIGHT_BOLD}%s${WEIGHT_NORMAL} not found. \`%s\`${NL}${NL}"
MSG_NON_UNIQUE_SUB="${NL}${IDENT}${COLOR_RED}ERR!${COLOR_RESET} ${WEIGHT_BOLD}%s${WEIGHT_NORMAL} occurrences found. 1 required. \`%s\`${NL}${NL}"
MSG_INSERTED="${IDENT}[%s] %s ${COLOR_GREEN}${WEIGHT_BOLD}[inlined]${WEIGHT_NORMAL}${COLOR_RESET}${NL}"
MSG_BEGIN="Script ${WEIGHT_BOLD}%s${WEIGHT_NORMAL}${NL}"

printf "${MSG_BEGIN}" "${0##*/}"
[ -d "${DIST_DIR}" ] || {
    printf "${MSG_NOT_FOUND}" "\$DIST_DIR" "${DIST_DIR}"; exit 1
}

for i in "${!TARGET_ENTRYPOINT_SUBSTITUTION[@]}"
do
    entry="${TARGET_ENTRYPOINT_SUBSTITUTION[$i]}"

    # prepare regular expression arguments
    re_target=".+\/${entry%% || *}$"
    re_entrypoint="${entry#* || }"; re_entrypoint=".+\/${re_entrypoint%% || *}$"
    re_substitution="${entry##* || }"

    target=$(find -E "${DIST_DIR}" -maxdepth 1 -type f -regex "${re_target}")
    if [ -f "${target}" ] && [[ "${target}" =~ $re_target ]]
    then
        contenthash=${BASH_REMATCH[1]}

        entrypoint=$(find -E "${DIST_DIR}" -maxdepth 1 -type f -regex "${re_entrypoint}")
        [ -f "${entrypoint}" ] || {
            printf "${MSG_NOT_FOUND}" "\$entrypoint" "${re_entrypoint}"; exit 1
        }

        # catch zero or multiple occurrences
        occurrences=$(grep -oa "${re_substitution}" "${entrypoint}" | wc -l)
        [ $occurrences -eq 1 ] || {
            printf "${MSG_NON_UNIQUE_SUB}" $occurrences "${re_substitution}"; exit 1
        }

        # perform substitution
        sed -e "s:${re_substitution}:\1.${contenthash}\2:" \
            "${entrypoint}" > "${entrypoint}.bak" \
            && mv "${entrypoint}.bak" "${entrypoint}"

        # ref: http://sed.sourceforge.net/sedfaq5.html#s5.8
        [ $? -eq 0 ] && printf "${MSG_INSERTED}" $i $contenthash
    else
        printf "${MSG_NOT_FOUND}" "\$target" "${re_target}"; exit 1
    fi
done
