"use client";
import Link from "next/link";
import { getPosts } from "@/app/actions/post.action";
import { useEffect, useState } from "react";
import { Button, Input, Select } from "antd";

type Jobs = Awaited<ReturnType<typeof getPosts>>;
type Job = Jobs[number];

export default function JobsPage() {
  const options = [
    {
      label: "All Types",
      value: "",
    },
    {
      label: "Full-time",
      value: "Full-time",
    },
    {
      label: "Part-time",
      value: "Part-time",
    },
  ];

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const [jobs, setJobs] = useState<Jobs>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (data: object = {}) => {
    const jobs = await getPosts(data);
    setJobs(jobs);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleSearch = () => {
    const params = {
      query,
      location,
      type,
    };
    fetchJobs(params);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</h1>
        <form className="grid gap-4 md:grid-cols-3">
          <Input
            value={query}
            onChange={handleQueryChange}
            placeholder="Search jobs..."
          />
          <Select
            value={type}
            options={options}
            onChange={handleTypeChange}
          ></Select>
          <Input
            value={location}
            onChange={handleLocationChange}
            placeholder="Location"
          />
          <Button
            type="primary"
            onClick={handleSearch}
            className="md:col-span-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Search
          </Button>
        </form>
      </div>

      <div className="grid gap-6">
        {jobs.map((job: Job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">{job.location}</span>
                  <span>{job.type}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </p>
              </div>
              {job.salary && (
                <span className="text-lg font-semibold text-gray-900">
                  {job.salary}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Posted by {job.postedBy.name}
              </span>
              <Link
                href={`/jobs/${job.id}`}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
