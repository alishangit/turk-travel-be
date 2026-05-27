up:
	docker compose -f devops/docker-compose.local.yml --project-name turk-travel up
down:
	docker compose -f devops/docker-compose.local.yml --project-name turk-travel down
