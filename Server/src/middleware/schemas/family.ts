import z from "zod";
import { makeValidator } from "@utils/validation";
import { FamilyRole } from "@familyflow/contracts";

const familyRoles: [FamilyRole, ...FamilyRole[]] = [
  "OWNER",
  "PARENT",
  "CHILD",
  "MEMBER",
];

const familyIdParamSchema = z.coerce
  .number()
  .int()
  .positive("Invalid family ID");
const memberIdParamSchema = z.coerce
  .number()
  .int()
  .positive("Invalid member ID");
const familyNameSchema = z.coerce
  .string()
  .trim()
  .min(1, "Family name is required")
  .max(100);

const createFamilySchema = z.object({
  name: familyNameSchema,
});

const getFamilyByIdSchema = z.object({
  familyId: familyIdParamSchema,
});

const updateFamilySchema = z.object({
  familyId: familyIdParamSchema,
  name: familyNameSchema,
});

const deleteFamilySchema = z.object({
  familyId: familyIdParamSchema,
});

const addFamilyMemberSchema = z
  .object({
    familyId: familyIdParamSchema,
    userId: z.coerce.number().int().positive(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email format")
      .optional(),
    role: z.enum(familyRoles).optional().default("MEMBER"),
  })
  .refine(
    data =>
      data.userId !== undefined ||
      (data.email !== undefined && data.email.length > 0),
    {
      message: "Must provide either userId or email to add a member",
    }
  );

const updateFamilyMemberRoleSchema = z.object({
  familyId: familyIdParamSchema,
  memberId: memberIdParamSchema,
  role: z.enum(familyRoles),
});

const deleteFamilyMemberSchema = z.object({
  id: familyIdParamSchema,
  memberId: memberIdParamSchema,
});

export const validateCreateFamily = makeValidator(createFamilySchema, {
  body: true,
});

export const validateGetFamilyById = makeValidator(getFamilyByIdSchema, {
  params: true,
});

export const validateUpdateFamily = makeValidator(updateFamilySchema, {
  params: true,
  body: true,
});

export const validateDeleteFamily = makeValidator(deleteFamilySchema, {
  params: true,
});

export const validateAddFamilyMember = makeValidator(addFamilyMemberSchema, {
  params: true,
  body: true,
});

export const validateUpdateFamilyMemberRole = makeValidator(
  updateFamilyMemberRoleSchema,
  {
    params: true,
    body: true,
  }
);

export const validateDeleteFamilyMember = makeValidator(
  deleteFamilyMemberSchema,
  {
    params: true,
  }
);
