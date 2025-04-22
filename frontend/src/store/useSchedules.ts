// store/useSchedules.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "http://localhost:8080/schedules";

export interface Schedule {
  id: number;
  date: string;
  content: string;
  priorityLevel: number;
  keyword: string;
}

export const useAllSchedules = () => {
  return useQuery<Schedule[]>({
    queryKey: ["schedules", "all"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}`);
      return res.data;
    },
    retry: false,
  });
};

export const useSchedulesByDate = (date: string) => {
  return useQuery<Schedule[]>({
    queryKey: ["schedules", date],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}?date=${date}`);
      return res.data;
    },
    enabled: !!date,
    retry: false,
  });
};

// 일정 추가
export const useAddSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSchedule: Omit<Schedule, "id">) => {
      const res = await axios.post(API_BASE, newSchedule);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["schedules", data.date],
      });
    },
  });
};

// 일정 삭제
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

// 일정 수정
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedSchedule: Schedule) => {
      const res = await axios.put(`${API_BASE}/${updatedSchedule.id}`, updatedSchedule);
      return res.data;
    },
    onSuccess: (_, updated) => {
      queryClient.invalidateQueries({ queryKey: ["schedules", updated.date] });
    },
  });
};