resource "digitalocean_loadbalancer" "ingress_load_balancer" {
  name   = "${var.cluster_name}-lb"
  region = var.region
  size = "lb-small"
  algorithm = "round_robin"

  forwarding_rule {
    entry_port     = 80
    entry_protocol = "http"

    target_port     = 80
    target_protocol = "http"
  }

  forwarding_rule {
    entry_port     = 443
    entry_protocol = "https"

    target_port     = 443
    target_protocol = "https"
    tls_passthrough = true
  }
  

  lifecycle {
      ignore_changes = [
        forwarding_rule,
    ]
  }

}
