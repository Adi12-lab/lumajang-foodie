"use client"
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, SquarePlus } from "lucide-react";
import { cn } from "~/lib/utils";
import { axiosInstance } from "~/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "~/hooks";
import { Button } from "~/components/ui/button";
import { FluentSave } from "~/icons";
import { useRouter } from "next/navigation";

interface ArchiveButtonProps {
  menu: string;
}

function ArchiveButton({ menu }: ArchiveButtonProps) {
  const { user: userAuth } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["check-archive", { auth: userAuth && userAuth.id, menu }],
    queryFn: async () => {
      return (await axiosInstance.get(`/menu-archive/find?menu=${menu}`)).data;
    },
    enabled: !!userAuth && !!userAuth.id && !!menu,
    retry: 2,
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ archive }: { archive: boolean }) => {
      if (archive) {
        return (await axiosInstance.delete(`/menu-archive?menu=${menu}`)).data;
      }
      return (await axiosInstance.post(`/menu-archive?menu=${menu}`)).data;
    },
    onSuccess: (data) => {
      if (data.type === "archive") {
        toast.success("Berhasil mengarsipkan");
      } else {
        toast.success("Berhasil menghapus arsip");
      }
      queryClient.invalidateQueries({
        queryKey: ["check-archive", { auth: userAuth && userAuth.id, menu }],
      });
    },
    onError: () => {
      toast.error("Gagal mengarsipkan");
    },
  });

  const handleArchiveToggle = () => {
    if (!Boolean(userAuth)) {
      return router.push("/login");
    }
    archiveMutation.mutate({ archive: Boolean(data) });
  };

  return (
    <Button
      variant={!!data ? "puce" : "outline"}
      onClick={handleArchiveToggle}
      className="flex items-center gap-x-2"
    >
      {!!data ? (
        <React.Fragment>
          <Check className="text-white group-hover:text-puce" />
          <span className="text-white group-hover:text-davy">Diarsipkan</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FluentSave width={27} height={27} fill="#A65F5F" />
          <span className="text-davy group-hover:text-white">Arsip</span>
        </React.Fragment>
      )}
    </Button>
  );
}

export default ArchiveButton;
