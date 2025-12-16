import MainTable from "../components/MainTable";
import NavBar from "../components/NavBar";
import MainCard from "../components/MainCard";
import API from "../services/api";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    await API.delete(`/expenses/${id}`);
    loadExpenses();
  };

  const handleEdit = () => {
    loadExpenses();
  };

  const filteredAndSortedExpenses = [...expenses]
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(
    filteredAndSortedExpenses.length / ITEMS_PER_PAGE
  );

  const paginatedExpenses = filteredAndSortedExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <NavBar />
      <h1 className="text-2xl text-center mt-3 font-bold">View Expenses</h1>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center px-6 mt-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2"
        />

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="amount-desc">Amount (High → Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low → High)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      <div className="p-6">
        <MainCard className="shadow-lg shadow-sky-950">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <MainTable
              data={paginatedExpenses}
              columns={[
                {
                  key: "date",
                  label: "Date",
                  render: (e) => new Date(e.date).toLocaleDateString(),
                },
                { key: "title", label: "Title" },
                { key: "category", label: "Category" },
                {
                  key: "amount",
                  label: "Amount",
                  render: (e) => `$${e.amount}`,
                },
              ]}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isLoading={loading}
              noDataMessage="No expenses found"
            />
          )}

          {/* PAGINATION */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </MainCard>
      </div>
    </>
  );
};

export default ViewExpenses;
