import type { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "@utils/errors";
import z from "zod";

type ValidatorSources = {
  body?: boolean;
  query?: boolean;
  params?: boolean;
};

export const makeValidator = (
  schema: z.ZodTypeAny,
  sources: ValidatorSources = { body: true },
  messagePrefix = "Validation error:"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      let targetSchema: any = schema;
      while (targetSchema && "_def" in targetSchema) {
        if (targetSchema._def.typeName === "ZodEffects") {
          targetSchema = targetSchema.innerType();
        } else if (
          targetSchema._def.typeName === "ZodOptional" ||
          targetSchema._def.typeName === "ZodNullable"
        ) {
          targetSchema = targetSchema.unwrap();
        } else {
          break;
        }
      }

      const isStructuredSchema =
        targetSchema &&
        targetSchema._def?.typeName === "ZodObject" &&
        targetSchema.shape &&
        ("body" in targetSchema.shape ||
          "query" in targetSchema.shape ||
          "params" in targetSchema.shape);

      if (isStructuredSchema) {
        const dataToValidate = {
          body: req.body,
          query: req.query,
          params: req.params,
        };

        const parseResult = schema.safeParse(dataToValidate);

        if (!parseResult.success) {
          next(
            new ValidationError(
              "Path: " +
                req.originalUrl +
                ". \n " +
                messagePrefix +
                parseResult.error.issues.map(e => e.message).join(", ")
            )
          );
          return;
        }

        const parsedData = parseResult.data as {
          body?: unknown;
          query?: unknown;
          params?: unknown;
        };

        req.validated = {
          body: parsedData.body ?? req.validated?.body ?? req.body,
          query: parsedData.query ?? req.validated?.query ?? req.query,
          params: parsedData.params ?? req.validated?.params ?? req.params,
        };
      } else {
        const activeSources = [
          sources.params ? "params" : null,
          sources.query ? "query" : null,
          sources.body ? "body" : null,
        ].filter(Boolean) as Array<"body" | "query" | "params">;

        let dataToValidate: unknown;
        if (activeSources.length === 1) {
          dataToValidate = req[activeSources[0]];
        } else {
          dataToValidate = {
            ...(sources.params ? req.params : {}),
            ...(sources.query ? req.query : {}),
            ...(sources.body ? req.body : {}),
          };
        }

        const parseResult = schema.safeParse(dataToValidate);

        if (!parseResult.success) {
          next(
            new ValidationError(
              "Path: " +
                req.originalUrl +
                ". \n " +
                messagePrefix +
                parseResult.error.issues.map(e => e.message).join(", ")
            )
          );
          return;
        }

        const currentValidated = req.validated ?? {
          body: req.body,
          query: req.query,
          params: req.params,
        };

        if (activeSources.length === 1) {
          req.validated = {
            ...currentValidated,
            [activeSources[0]]: parseResult.data,
          };
        } else {
          const validatedParams: Record<string, unknown> = {
            ...(req.params || {}),
          };
          const validatedQuery: Record<string, unknown> = {
            ...(req.query || {}),
          };
          const validatedBody: Record<string, unknown> = {
            ...(req.body || {}),
          };

          if (
            typeof parseResult.data === "object" &&
            parseResult.data !== null
          ) {
            for (const [key, value] of Object.entries(parseResult.data)) {
              if (sources.params && req.params && key in req.params) {
                validatedParams[key] = value;
              } else if (sources.query && req.query && key in req.query) {
                validatedQuery[key] = value;
              } else if (sources.body) {
                validatedBody[key] = value;
              }
            }
          }

          req.validated = {
            body: sources.body ? validatedBody : currentValidated.body,
            query: sources.query ? validatedQuery : currentValidated.query,
            params: sources.params ? validatedParams : currentValidated.params,
          };
        }
      }

      next();
    } catch {
      next(new AppError("Validation middleware error", 500));
    }
  };
};
