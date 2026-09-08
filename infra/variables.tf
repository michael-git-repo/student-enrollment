variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "student-enrollment"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "container_image" {
  type    = string
  default = "public.ecr.aws/docker/library/nginx:alpine"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "task_cpu" {
  type    = number
  default = 256
}

variable "task_memory" {
  type    = number
  default = 512
}
