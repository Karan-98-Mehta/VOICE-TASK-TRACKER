import React from "react";
import { Space, Tag, Typography, Tooltip, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./TaskCard.css";

const { Paragraph } = Typography;

export default function TaskCard({ task, onToggle, onEdit }) {
  const statusColor = {
    Pending: "default",
    "In Progress": "processing",
    Completed: "success",
  }[task.status];

  return (
    <div
      onClick={() => onToggle(task.id)}
      className="task-card"
    >
      <Space
        align="center"
        style={{
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 4,
        }}
      >
        <Paragraph strong style={{ margin: 0, flex: 1 }} ellipsis={{ rows: 1 }}>
          {task.title || "(Untitled)"}
        </Paragraph>
        <Space>
          <Tag color={statusColor}>{task.status}</Tag>
          <Tooltip title="Edit">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            />
          </Tooltip>
        </Space>
      </Space>
      <Paragraph type="secondary" style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
        {task.description || "No description"}
      </Paragraph>
    </div>
  );
}
