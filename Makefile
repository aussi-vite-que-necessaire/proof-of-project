# Makefile

# Déploie les migrations et lance en local (si tu avais un docker-compose local)
dev:
	docker compose up

# Connexion SSH rapide au serveur
ssh:
	ssh deployer@95.217.181.5

# Voir les logs de prod
logs:
	ssh deployer@95.217.181.5 "cd ~/apps/proof-of-project && docker compose logs -f"

# Faire un backup manuel
backup:
	ssh deployer@95.217.181.5 "cd ~/apps/proof-of-project && docker compose exec db-backup /backup.sh"

# Reset la DB de prod (DANGER)
reset-db:
	ssh deployer@95.217.181.5 "cd ~/apps/proof-of-project && docker compose down -v && docker compose up -d"