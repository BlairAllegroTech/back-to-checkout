import { Config } from "jest"
import { pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.json"

const config: Config = {
  testTimeout: 5 * 1000,
  testEnvironment: "node",
  roots: ["<rootDir>"],
  verbose: true,
  reporters: ["default", ["summary", { summaryThreshold: 1 }]],

  projects: [
    {
      displayName: "micro",
      testMatch: ["<rootDir>/src/**/*.micro.ts"],
      preset: "ts-jest",
      modulePaths: [compilerOptions.baseUrl],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
    }
    // {
    //   displayName: "integration",
    //   testMatch: ["<rootDir>/src/**/*.integration.ts"],
    //   preset: "ts-jest",
    //   slowTestThreshold: 1,
    //   modulePaths: [compilerOptions.baseUrl],
    //   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    //   setupFilesAfterEnv: ["<rootDir>/jestSetup.js"]
    // },
    // {
    //   displayName: "deployment",
    //   testMatch: ["<rootDir>/src/**/*.deployment.ts"],
    //   preset: "ts-jest",
    //   slowTestThreshold: 1,
    //   modulePaths: [compilerOptions.baseUrl],
    //   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
    // }
  ],
  maxWorkers: "50%",
  workerIdleMemoryLimit: 0.1
}

export default config
