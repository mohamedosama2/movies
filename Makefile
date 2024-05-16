.PHONY: init
init:
	@cd terraform && terraform init

.PHONY: plan
plan:
	@cd terraform && terraform plan -var-file="production.tfvars" -lock=false

.PHONY: apply
apply:
	@cd terraform && terraform apply -auto-approve -var-file="production.tfvars" -lock=false

.PHONY: destroy
destroy:
	@cd terraform && terraform destroy -auto-approve -var-file="production.tfvars" -lock=false
