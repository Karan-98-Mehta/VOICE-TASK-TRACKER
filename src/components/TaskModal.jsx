import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, Typography } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { useSpeech } from "../hooks/useSpeech";

const { Text } = Typography;

export default function TaskModal({ open, initial, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initial?.id);

  const speechTitle = useSpeech();
  const speechDesc = useSpeech();

  const [titleValue, setTitleValue] = useState("");
  const [descValue, setDescValue] = useState("");

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (open) {
      const t = initial?.title ?? "";
      const d = initial?.description ?? "";
      form.setFieldsValue({ title: t, description: d });
      setTitleValue(t);
      setDescValue(d);
      setPreview("");
    } else {
      form.resetFields();
      setTitleValue("");
      setDescValue("");
      setPreview("");
    }
  }, [open, initial, form]);

  useEffect(() => {
    if (!speechTitle.listening && speechTitle.transcript) {
      const txt = speechTitle.transcript.trim();
      form.setFieldsValue({ title: txt });
      setTitleValue(txt);
      setPreview(txt);
    }
  }, [speechTitle.listening, speechTitle.transcript, form]);

  useEffect(() => {
    if (!speechDesc.listening && speechDesc.transcript) {
      const txt = speechDesc.transcript.trim();
      form.setFieldsValue({ description: txt });
      setDescValue(txt);
      setPreview(txt);
    }
  }, [speechDesc.listening, speechDesc.transcript, form]);

  useEffect(() => {
    if (!preview) return;
    const t = setTimeout(() => setPreview(""), 3000);
    return () => clearTimeout(t);
  }, [preview]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...initial, ...values, status: initial?.status || "Pending" });
    });
  };

  const micButtonStyle = {
    position: "absolute",
    right: 12,
    zIndex: 4,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1677ff",
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={isEdit ? "Save" : "Create"}
      title={isEdit ? "Edit Task" : "Add New Task"}
      centered
      destroyOnClose={false}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Text type="secondary">
          Use the mic buttons to fill the fields directly, or type manually.
        </Text>

        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please provide a title" }]}
          >
            <div style={{ position: "relative" }}>
              <Input
                placeholder={speechTitle.listening ? "Listening..." : "A title for the task"}
                // allowClear
                value={titleValue}
                onChange={(e) => {
                  const v = e.target.value;
                  setTitleValue(v);
                  form.setFieldsValue({ title: v });
                }}
                style={{ paddingRight: 56, height: 40 }}
              />
              <Button
                type={speechTitle.listening ? "primary" : "default"}
                icon={<AudioOutlined />}
                onClick={speechTitle.listening ? speechTitle.stop : speechTitle.start}
                disabled={!speechTitle.supported}
                aria-label="Record title"
                style={{
                  ...micButtonStyle,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: speechTitle.listening ? "2px solid #1677ff" : "1px solid #e6edf9",
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please provide a description" }]}
          >
            <div style={{ position: "relative" }}>
              <Input.TextArea
                placeholder={speechDesc.listening ? "Listening..." : "A brief about the task"}
                showCount
                maxLength={200}
                // allowClear
                autoSize={{ minRows: 3, maxRows: 6 }}
                value={descValue}
                onChange={(e) => {
                  const v = e.target.value;
                  setDescValue(v);
                  form.setFieldsValue({ description: v });
                }}
                style={{ paddingRight: 56 }}
              />
              <Button
                type={speechDesc.listening ? "primary" : "default"}
                icon={<AudioOutlined />}
                onClick={speechDesc.listening ? speechDesc.stop : speechDesc.start}
                disabled={!speechDesc.supported}
                aria-label="Record description"
                style={{
                  ...micButtonStyle,
                  bottom: 12,
                  border: speechDesc.listening ? "2px solid #1677ff" : "1px solid #e6edf9",
                }}
              />
            </div>
          </Form.Item>
        </Form>

        {/* Common transcript preview (auto-clears) */}
        {preview && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Transcript preview:</Text>
            <div style={{ marginTop: 6, fontStyle: "italic" }}>{preview}</div>
          </div>
        )}
      </Space>
    </Modal>
  );
}
