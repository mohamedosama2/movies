# cert-manager resources

resource "helm_release" "cert-manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "v1.11.1"
  namespace        = "kube-system"
  timeout          = 120
   depends_on = [
    kubernetes_ingress_v1.default_cluster_ingress,
  ] 
  set {
    name  = "createCustomResource"
    value = "true"
  }
  set {
    name = "installCRDs"
    value = "true"
  }
}

resource "helm_release" "cluster-issuer" {
  name      = "cluster-issuer"
  chart     = "../helm_charts/cluster-issuer"
  namespace = "kube-system"
  depends_on = [
    helm_release.cert-manager,
  ]
  set {
    name  = "letsencrypt_emaill"
    value = "${var.letsencrypt_email}"
  }
}
