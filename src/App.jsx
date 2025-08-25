import React, { useState, useMemo, useEffect } from "react";
import {
  App as AntdApp,
  Button,
  Empty,
  Flex,
  Input,
  Layout,
  List,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  AudioOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSpeech } from "./hooks/useSpeech";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const STATUSES = ["Pending", "In Progress", "Completed"];
const nextStatus = (s) =>
  STATUSES[(STATUSES.indexOf(s) + 1) % STATUSES.length];

export default function App() {
  const [tasks, setTasks] = useLocalStorage("voice_tasks", []);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const speechSearch = useSpeech();
  useEffect(() => {
    if (!speechSearch.listening && speechSearch.transcript) {
      setQuery((q) => q || speechSearch.transcript);
    }
  }, [speechSearch.listening, speechSearch.transcript]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [tasks, query]);

  const handleCreateOrSave = (data) => {
    if (data.id) {
      setTasks((prev) =>
        prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))
      );
    } else {
      const id = crypto.randomUUID();
      setTasks((prev) => [{ id, status: "Pending", ...data }, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const toggleStatus = (id) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: nextStatus(t.status) } : t
      )
    );

  const openEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const emptyState = (
    <div style={{ padding: 64 }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Space direction="vertical" size={0}>
            <Title level={3} style={{ marginBottom: 0 }}>
              Tasks
            </Title>
            <Text type="secondary">
              There are no records of Tasks yet. Please add one to get started.
            </Text>
          </Space>
        }
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </Button>
      </Empty>
    </div>
  );

  return (
    <AntdApp>
      <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
        <Header style={{ background: "#ffffff", padding: "12px 24px" }}>
          <Flex align="center" justify="space-between" style={{ height: "100%"}}>
            <Title level={3} style={{ color: "#1f2937", margin: 0 }}>
              Tasks
            </Title>
            <Space>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                allowClear
                prefix={<SearchOutlined />}
                style={{ width: 320 }}
              />
              <Tooltip
                title={
                  !speechSearch.supported
                    ? "Speech not supported"
                    : speechSearch.listening
                    ? "Stop"
                    : "Voice Search"
                }
              >
                <Button
                  icon={
                    speechSearch.listening ? (
                      <SyncOutlined spin />
                    ) : (
                      <AudioOutlined />
                    )
                  }
                  onClick={
                    speechSearch.listening
                      ? speechSearch.stop
                      : speechSearch.start
                  }
                  disabled={!speechSearch.supported}
                />
              </Tooltip>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
              >
                Add Task
              </Button>
            </Space>
          </Flex>
        </Header>
        <Content style={{ padding: 24 }}>
          {!tasks.length ? (
            emptyState
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filtered}
              rowKey={(t) => t.id}
              renderItem={(item) => (
                <List.Item
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    padding: "12px 0",
                  }}
                >
                  <TaskCard task={item} onToggle={toggleStatus} onEdit={openEdit} />
                </List.Item>
              )}
            />
          )}
        </Content>
      </Layout>
      <TaskModal
        open={modalOpen}
        initial={editing}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleCreateOrSave}
      />
    </AntdApp>
  );
}
