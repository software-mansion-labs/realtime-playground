import { StyleSheet } from 'react-native'

import { colors } from '../theme'

export const tableStyles = StyleSheet.create({
  body: {
    gap: 0,
  },
  caption: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  cell: {
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  cellText: {
    color: colors.foreground,
    fontSize: 14,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: colors.secondary,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headText: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  table: {
    minWidth: '100%',
  },
})
