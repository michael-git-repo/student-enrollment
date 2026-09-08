# AWS deployment

The deploy workflow publishes the Docker image to ECR, deploys it to ECS Fargate, and prints an Application Load Balancer URL.

## One-time AWS setup

1. Create an S3 bucket for Terraform state in `us-east-1` with versioning enabled. The bucket must be private and have public access blocked.
2. In GitHub, open **Settings > Secrets and variables > Actions** and add:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` with value `us-east-1`
   - `TF_STATE_BUCKET` with the S3 state bucket name
3. Create a GitHub Actions environment named `production` if you want deployment approval before AWS changes.
4. Push to `main` or manually run the **Deploy** workflow.

The workflow first creates the ECR repository, pushes the image, then creates the VPC, ALB, ECS service, DynamoDB table, and IAM roles. When it finishes, open the `website_url` shown in the workflow logs.

## Costs and safety

This creates billable AWS resources, including an Application Load Balancer and ECS Fargate task. Use synthetic data only. The app has no login yet and is not suitable for real student information. Run `terraform destroy` from a configured local Terraform checkout when you want to remove the resources.

For stronger security, replace the long-lived AWS access-key GitHub secrets with GitHub OIDC and an IAM deployment role.
