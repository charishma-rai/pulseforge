import React from 'react'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { Card } from '@/components/core/Card'
import { Construction } from 'lucide-react'

export function Placeholder({ title, description }) {
  return (
    <PageContainer>
      <PageHeader title={title} subtitle={description || 'This module is under active development.'} />
      <Card className="py-20 text-center border-dashed border-2">
        <Construction size={48} className="mx-auto text-fg-tertiary opacity-20 mb-4" />
        <p className="text-body text-fg-tertiary">Coming soon — check back shortly.</p>
      </Card>
    </PageContainer>
  )
}
