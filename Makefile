# --- VARIABLES ---
# L'alias SSH défini dans ton ~/.ssh/config
SSH_HOST = avqn-prod
# Le dossier du projet sur le serveur
REMOTE_DIR = ~/apps/proof-of-project

# --- COMMANDES ---

# 1. Connexion SSH directe (en tant que deployer)
ssh:
	ssh $(SSH_HOST)

# 2. Voir les logs en direct
logs:
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose logs -f"

# 3. Faire un backup manuel immédiat
backup:
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose exec db-backup /backup.sh"

# 4. Reset la DB (Attention danger)
reset-db:
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose down -v && docker compose up -d"

# 5. Ouvrir une console Rails/Node/DB (exemple)
console:
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose exec app sh"

# 6. Appliquer les migrations
migrate:
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose exec app npm run db:migrate"