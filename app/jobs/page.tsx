"use client";
import Link from "next/link";
import { getPosts } from "../actions/post.action";
import PostSearchBar from "@/components/Post/SearchBar";
import { FormEvent, useEffect, useState } from "react";

type Jobs = Awaited<ReturnType<typeof getPosts>>;
type Job = Jobs[number];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Jobs>([]);

  const fetchJobs = async (data: any = {}) => {
    const jobs = await getPosts(data);
    setJobs(jobs);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      location: formData.get("location"),
      type: formData.get("type"),
    };
    fetchJobs(data);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</h1>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSearch}>
          <input
            type="text"
            name="title"
            placeholder="Search jobs..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <select
            name="type"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
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
