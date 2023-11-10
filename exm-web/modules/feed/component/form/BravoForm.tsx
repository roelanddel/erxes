"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import LoadingPost from "@/components/ui/loadingPost"
import SuccessPost from "@/components/ui/successPost"
import { Textarea } from "@/components/ui/textarea"
import SelectUsers from "@/components/select/SelectUsers"

import useFeedMutation from "../../hooks/useFeedMutation"
import { IFeed } from "../../types"
import FormAttachments from "./FormAttachments"
import FormImages from "./FormImages"
import Uploader from "./uploader/Uploader"

const FormSchema = z.object({
  description: z
    .string({
      required_error: "Please enter an description",
    })
    .refine((val) => val.trim().length !== 0, {
      message: "Please enter an description",
    }),
  recipientIds: z.array(z.object({})).refine((val) => val.length !== 0, {
    message: "Please choose users",
  }),
})

const BravoForm = ({
  feed,
  setOpen,
}: {
  feed?: IFeed
  setOpen: (open: boolean) => void
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [recipientIds, setRecipientIds] = useState(feed?.recipientIds || [])
  const [success, setSuccess] = useState(false)
  const [images, setImage] = useState(feed?.images || [])
  const [attachments, setAttachments] = useState(feed?.attachments || [])
  const [imageUploading, setImageUploading] = useState(false)
  const [attachmentUploading, setAttachmentUploading] = useState(false)

  const callBack = (result: string) => {
    if (result === "success") {
      form.reset()
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        setOpen(false)
      }, 1500)
    }
  }

  const { feedMutation, loading: mutationLoading } = useFeedMutation({
    callBack,
  })

  useEffect(() => {
    let defaultValues = {} as any

    if (feed) {
      defaultValues = { ...feed }

      defaultValues.recipientIds = feed.recipientIds ? [{}] : []
    }

    form.reset({ ...defaultValues })
  }, [feed])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    feedMutation(
      {
        title: "title",
        description: data.description ? data.description : "",
        contentType: "bravo",
        recipientIds,
        images,
        attachments,
      },
      feed?._id || ""
    )
  }

  return (
    <DialogContent className="max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Create bravo</DialogTitle>
      </DialogHeader>

      {mutationLoading ? <LoadingPost /> : null}
      {success ? <SuccessPost /> : null}

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Write a bravo"
                    {...field}
                    defaultValue={feed?.description || ""}
                    className="p-0 border-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormAttachments
            attachments={attachments || []}
            setAttachments={setImage}
          />
          <FormImages images={images} setImage={setImage} />{" "}
          <FormField
            control={form.control}
            name="recipientIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SelectUsers
                    userIds={recipientIds}
                    onChange={setRecipientIds}
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center border rounded-lg px-2 border-[#cccccc] justify-between">
            <p className="text-[#444]">Add attachments</p>
            <div className="flex">
              <Uploader
                defaultFileList={images || []}
                onChange={setImage}
                type={"image"}
                icon={true}
                iconSize={20}
                setUploading={setImageUploading}
              />

              <Uploader
                defaultFileList={attachments || []}
                onChange={setAttachments}
                icon={true}
                iconSize={20}
                setUploading={setAttachmentUploading}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="font-semibold w-full rounded-full"
            disabled={imageUploading || attachmentUploading}
          >
            Post
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}

export default BravoForm
