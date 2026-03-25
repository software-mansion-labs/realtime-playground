import { StyleSheet } from 'react-native'

import { colors, radii, shadow } from '../theme'

export const cardStyles = StyleSheet.create({
  action: {
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 20,
    paddingVertical: 12,
    ...shadow,
  },
  content: {
    gap: 12,
    paddingHorizontal: 12,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
  },
  header: {
    gap: 8,
    paddingHorizontal: 12,
  },
  title: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textTransform: 'capitalize',
  },
})
