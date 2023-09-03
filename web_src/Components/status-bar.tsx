import useSWR from "swr";
import React from "react"

export const DiskUsage: React.FC = (props) => {
  const { data, isLoading, error } = useSWR<{}>(...{});

  return (

  )
};

export const GitVerison: React.FC = () =>{
  const {data, isLoading, error} = useSWR()

  return (

  )
}

export const StatusBar: React.FC = () =>{
  return (
    <div>
      <div>
        <DiskUsage />
        <GitVerison />
      </div>
    </div>
  )
}

