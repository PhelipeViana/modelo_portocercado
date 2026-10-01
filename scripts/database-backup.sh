#!/bin/sh
set -eu

backup_once() {
  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  destination="/backups/portocercado-${timestamp}.sql.gz"
  temporary="${destination}.partial"
  sql_file="/backups/.portocercado-${timestamp}.sql"
  mkdir -p /backups
  echo "[$(date -u +%FT%TZ)] Gerando backup PostgreSQL: ${destination}"
  pg_dump --format=plain --no-owner --no-privileges --file="${sql_file}"
  gzip -9 < "${sql_file}" > "${temporary}"
  rm -f "${sql_file}"
  gzip -t "${temporary}"
  mv "${temporary}" "${destination}"
  find /backups -type f -name 'portocercado-*.sql.gz' -mtime "+${BACKUP_RETENTION_DAYS:-14}" -delete
}

case "${1:-once}" in
  once) backup_once ;;
  schedule)
    while :; do
      backup_once || echo "[$(date -u +%FT%TZ)] Falha ao gerar backup; nova tentativa no próximo ciclo." >&2
      sleep "${BACKUP_INTERVAL_SECONDS:-86400}"
    done
    ;;
  *) echo "Uso: $0 [once|schedule]" >&2; exit 2 ;;
esac
