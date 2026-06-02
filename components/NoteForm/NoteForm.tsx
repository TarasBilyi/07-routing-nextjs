"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import css from "./NoteForm.module.css";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { createNote } from "@/lib/api";
import { NewNoteBody } from "@/types/note";

interface NoteFormProps {
  onClose: () => void;
}

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const fieldId = useId();

  const mutation = useMutation({
    mutationFn: (newNote: NewNoteBody) => createNote(newNote),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
      toast.success("Note created successfully!");
    },
    onError: () => {
      toast.error("Failed to create note. Please try again.");
    },
  });
  const CreateNoteSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title cannot be longer than 50 characters")
      .required("Title is required"),
    content: Yup.string().max(
      500,
      "Content cannot be longer than 500 characters",
    ),
    tag: Yup.string()
      .oneOf(
        ["Todo", "Work", "Personal", "Meeting", "Shopping"],
        "Please select a valid tag",
      )
      .required("Tag is required"),
  });

  const initialValues: NewNoteBody = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = (
    values: NewNoteBody,
    { resetForm }: FormikHelpers<NewNoteBody>,
  ) => {
    mutation.mutate(values);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={CreateNoteSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;
