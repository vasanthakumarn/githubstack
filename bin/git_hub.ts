#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GitHubStack } from '../lib/git_hub-stack';

const app = new cdk.App();
new GitHubStack(app, 'GitHubStack');
