import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';
import { BuildSpec, ComputeType, EventAction, FilterGroup, LinuxBuildImage, Project, Source } from 'aws-cdk-lib/aws-codebuild';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export class BuildStack extends cdk.Stack {
    /**
   * CodeBuild project definition
   */
  public buildProject: Project
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props);

        const source = Source.gitHub({
            owner: 'vasanthakumarn',
            repo: 'git@github.com:vasanthakumarn/githubstack.git',
            webhook: true,
            webhookFilters: [
              FilterGroup.inEventOf(EventAction.PUSH).andBranchIsNot('main'),
            ],
          });

          this.buildProject = new Project(this, 'github-pr-build', {
            description: 'Github PR build project.',
            projectName: 'github-pr-build',
            source,
            buildSpec: BuildSpec.fromObject({
              version: '0.2',
              phases: {
                install: {
                  commands: [
                    'nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay2 &',
                    'timeout 15 sh -c "until docker info; do echo .; sleep 1; done"',
                  ],
                },
                pre_build: {
                  commands: ['yarn install --frozen-lockfile'],
                },
                build: {
                  commands: ['yarn cdk synth', 'yarn test:coverage'],
                },
              },
              reports: {
                coverage: {
                  files: ['coverage/clover.xml'],
                  'file-format': 'CLOVERXML',
                },
              },
            }),
            environment: {
              buildImage: LinuxBuildImage.STANDARD_4_0,
              computeType: ComputeType.MEDIUM,
              privileged: true,
            },
          })
      
          /**
           * The projects require administration privileges in order to be able to
           * create and/or modify resources created by the falcon-* stacks.
           *
           * @todo Implement tighter lockdown of permissions.
           */
          this.buildProject.addToRolePolicy(
            new PolicyStatement({
              actions: ['*'],
              resources: ['*'],
            })
          )
    }
}