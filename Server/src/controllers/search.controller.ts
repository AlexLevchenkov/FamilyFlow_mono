import type {
  GlobalSearchParams,
  GlobalSearchResponse,
} from "@familyflow/contracts";
import searchService from "@services/search.service";
import apiResponse from "@utils/response";
import asyncHandler from "@utils/asyncHandler";
import type { GlobalSearchInput } from "@middleware/schemas/search";

class SearchController {
  search = asyncHandler(async (req, res) => {
    const { user } = req;
    const { query } = req.validated?.query as GlobalSearchInput;

    const data: GlobalSearchResponse = await searchService.search(
      user.id,
      { query } satisfies GlobalSearchParams
    );

    apiResponse(res, data, 200);
  });
}

export default new SearchController();
