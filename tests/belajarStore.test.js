import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBelajarStore } from '@/stores/useBelajarStore'

describe('Pinia Store - useBelajarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('simpanProfil menyimpan data ke store', async () => {
    const store = useBelajarStore()

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        json: async () => [],
        ok: true
      })
      .mockResolvedValueOnce({ ok: true })

    const dummy = {
      jurusan: 'TI',
      fakultas: 'Teknik',
      semester: 1
    }

    await store.simpanProfil(dummy)

    expect(store.profil.jurusan).toBe('TI')
    expect(store.profil.fakultas).toBe('Teknik')
  })

  it('simpanRencana() menyimpan rencana belajar ke state', async () => {
  const store = useBelajarStore()

  store.profil = {
    id: 1,
    jurusan: 'Manajemen',
    fakultas: 'Ekonomi',
    semester: 3
  }

  global.fetch = vi.fn()
    .mockResolvedValueOnce({ json: async () => [], ok: true }) // cek rencana
    .mockResolvedValueOnce({ json: async () => [], ok: true }) // ambil semua
    .mockResolvedValueOnce({ ok: true }) // post baru

  await store.simpanRencana('10.00 - 12.00')

  expect(store.rencana.jam).toBe('10.00 - 12.00')
  expect(store.rencana.profilId).toBe(1)
})

})
