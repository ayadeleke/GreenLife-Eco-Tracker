# [2.0.0](https://github.com/ayadeleke/GreenLife-Eco-Tracker/compare/v1.2.0...v2.0.0) (2025-07-30)


### Bug Fixes

* ensure Docker images are built before Terraform apply ([e2aa7c7](https://github.com/ayadeleke/GreenLife-Eco-Tracker/commit/e2aa7c77a29f2cf274cc34281edd3653ed0dc4df))


### BREAKING CHANGES

* Fix critical deployment order issue where Terraform was trying to deploy container apps with non-existent Docker images

- Split Terraform jobs into plan and apply phases for both staging and production
- Move Terraform Apply to run AFTER Docker images are built and pushed to ACR
- Establish correct dependency chain: Plan → Build → Scan → Push → Apply → Deploy
- Add new jobs: staging-terraform-apply and production-terraform-apply
- Fix version output passing between restructured jobs
- Prevent "MANIFEST_UNKNOWN" errors during container app deployment

# [1.2.0](https://github.com/ayadeleke/GreenLife-Eco-Tracker/compare/v1.1.3...v1.2.0) (2025-07-30)


### Features

* restructure CI/CD pipeline with proper job dependencies and parallel execution ([0f3832a](https://github.com/ayadeleke/GreenLife-Eco-Tracker/commit/0f3832a19d956018354550ffc0f0ac3516bec1b7))

## [1.1.3](https://github.com/ayadeleke/GreenLife-Eco-Tracker/compare/v1.1.2...v1.1.3) (2025-07-30)


### Bug Fixes

* resolve error with CI/CD pipeline running ([4532375](https://github.com/ayadeleke/GreenLife-Eco-Tracker/commit/453237507d232e9f59eeec5e18d0b6d913e29523))

## [1.1.2](https://github.com/ayadeleke/GreenLife-Eco-Tracker/compare/v1.1.1...v1.1.2) (2025-07-30)


### Bug Fixes

* **CI/CD Version:** fix versioning logic to correctly read latest release tag ([3aeb0ad](https://github.com/ayadeleke/GreenLife-Eco-Tracker/commit/3aeb0ad9ab67c3b4c6d14d5540cff2a3f098a463))

## [1.1.1](https://github.com/ayadeleke/GreenLife-Eco-Tracker/compare/v1.1.0...v1.1.1) (2025-07-30)


### Bug Fixes

* **security:** Used the right version of python, alpine and Node ([497a839](https://github.com/ayadeleke/GreenLife-Eco-Tracker/commit/497a839e5fb0a481dd3ada4f7320f31ad29c2979))

# [1.1.0](https://github.com/ayadeleke/GreenLife-Eco-Tracker/compare/v1.0.0...v1.1.0) (2025-07-30)


### Features

* Separate Staging and Production Environment resources ([df1559e](https://github.com/ayadeleke/GreenLife-Eco-Tracker/commit/df1559e8df57b3f5c385733f2e90fcc23b744ffd))
* Added separate environment config files for staging and production
* Created distinct deployment pipelines for each environment
* Configured environment-specific resource allocation
* Updated documentation to reflect environment separation
# 1.0.0 (2025-07-30)


### Bug Fixes

* **dependencies:** update lodash to address security vulnerability ([fb4d521])
* **dependencies:** update lodash to address security vulnerability ([c6b91af])
* **dependencies:** update lodash to address security vulnerability ([98420b7])
* **dependencies:** update lodash to address security vulnerability ([5a71858])
* **dependencies:** update lodash to address security vulnerability ([5c13831])
