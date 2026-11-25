jest.mock("@config/prisma", () => ({
  __esModule: true,
  default: {
    $queryRaw: jest.fn(),
  },
}));

import prisma from "@config/prisma";
import searchService from "@services/search.service";
import type { GlobalSearchResponse } from "@familyflow/contracts";

const queryRawMock = prisma.$queryRaw as jest.Mock;

describe("SearchService", () => {
  beforeEach(() => {
    queryRawMock.mockReset();
  });

  it("returns grouped results from one combined database query", async () => {
    const rows = [
      {
        type: "tasks",
        id: 1,
        title: "Buy groceries",
        date: new Date("2026-11-25T10:00:00.000Z"),
      },
      {
        type: "goals",
        id: 2,
        title: "Read more",
        date: null,
      },
      {
        type: "events",
        id: 3,
        title: "Family dinner",
        date: new Date("2026-11-25T18:00:00.000Z"),
      },
    ];
    queryRawMock.mockResolvedValue(rows);

    const results = await searchService.search(7, { query: "family" });

    expect(queryRawMock).toHaveBeenCalledTimes(1);
    expect(results).toEqual<GlobalSearchResponse>({
      tasks: [{ id: 1, title: "Buy groceries", date: rows[0].date }],
      goals: [{ id: 2, title: "Read more", date: null }],
      events: [{ id: 3, title: "Family dinner", date: rows[2].date }],
    });
  });

  it("returns empty groups when no rows match", async () => {
    queryRawMock.mockResolvedValue([]);

    await expect(searchService.search(7, { query: "missing" })).resolves.toEqual(
      {
        tasks: [],
        goals: [],
        events: [],
      }
    );
  });
});
