"use client";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getPostById, updatePostById } from "@/app/actions/post.action";
import { notFound, useRouter } from "next/navigation";
import { Button, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

// import ApplyButton from "./ApplyButton";
type Job = Awaited<ReturnType<typeof getPostById>>;

export default function JobPage({ params }: { params: { id: string } }) {
  const options = [
    {
      label: "Full-time",
      value: "Full-time",
    },
    {
      label: "Part-time",
      value: "Part-time",
    },
  ];
  const router = useRouter();
  const [form] = Form.useForm();
  const [job, setJob] = useState<Job | undefined>();
  useEffect(() => {
    getPost();
  }, []); // 空

  const getPost = async () => {
    let job: Job | undefined = undefined;
    try {
      const { id } = await params;
      job = await getPostById(id);
      if (!job) {
        notFound();
      }
      setJob(job);
      initFormValue(job);
    } catch (error) {
      console.log(error);
      notFound();
    }
    return job;
  };

  const initFormValue = (job: Job) => {
    form.setFieldsValue({
      job: {
        title: job?.title,
        company: job?.company,
        location: job?.location,
        type: job?.type,
        salary: job?.salary,
        description: job?.description,
      },
    });
  };

  const handleSave = async () => {
    const res = await updatePostById(job);
    if (res) {
      router.push("/jobs");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <Button onClick={() => router.back()} type="primary" className="mb-4">
            ← Back to Jobs
          </Button>

          <Form style={{ maxWidth: 600 }} scrollToFirstError form={form}>
            <Form.Item
              name={["job", "title"]}
              label="Title"
              rules={[{ required: true }]}
            >
              <Input
                value={job?.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                className="font-bold text-gray-900 mb-4"
              />
            </Form.Item>
            <Form.Item
              name={["job", "company"]}
              label="Company"
              rules={[{ required: true }]}
            >
              <Input
                value={job?.company}
                onChange={(e) => setJob({ ...job, company: e.target.value })}
                className="font-bold text-gray-900 mb-4"
              />
            </Form.Item>
            <Form.Item
              name={["job", "location"]}
              label="Location"
              rules={[{ required: true }]}
            >
              <Input
                value={job?.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                className="font-bold text-gray-900 mb-4"
              />
            </Form.Item>
            <Form.Item
              name={["job", "type"]}
              label="Type"
              rules={[{ required: true }]}
            >
              <Select
                value={job?.type}
                options={options}
                onChange={(e) => setJob({ ...job, type: e.target.value })}
                className="font-bold text-gray-900 mb-4"
              />
            </Form.Item>

            <Form.Item
              name={["job", "salary"]}
              label="Salary"
              rules={[{ required: true }]}
            >
              <Input
                value={job?.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                className="font-bold text-gray-900 mb-4"
              />
            </Form.Item>
            <Form.Item
              name={["job", "description"]}
              label="Description"
              rules={[{ required: true }]}
            >
              <TextArea
                value={job?.description}
                onChange={(e) =>
                  setJob({ ...job, description: e.target.value })
                }
                className="font-bold text-gray-900 mb-4"
              />
            </Form.Item>
          </Form>

          <div className="flex items-center text-sm text-gray-500">
            <span>Posted by {job?.postedBy.name}</span>
            <span className="mx-2">•</span>
            <span>
              {job?.postedAt &&
                formatDistanceToNow(new Date(job?.postedAt), {
                  addSuffix: true,
                })}
            </span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Button onClick={handleSave} type="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
