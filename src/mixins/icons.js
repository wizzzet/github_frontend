const icons = {
  'app:black:card': 'img:statics/images/icons/black/card.svg',
  'app:black:list': 'img:statics/images/icons/black/list.svg',
  'app:black:man': 'img:statics/images/icons/black/man.svg',
  'app:black:people': 'img:statics/images/icons/black/people.svg',
  'app:black:setting': 'img:statics/images/icons/black/setting.svg',
  'app:white:card': 'img:statics/images/icons/white/card.svg',
  'app:white:list': 'img:statics/images/icons/white/list.svg',
  'app:white:man': 'img:statics/images/icons/white/man.svg',
  'app:white:people': 'img:statics/images/icons/white/people.svg',
  'app:white:setting': 'img:statics/images/icons/white/setting.svg'
}

export const iconsMixin = {
  created () {
    this.$q.iconMapFn = (iconName) => {
      const icon = icons[iconName]
      if (icon !== void 0) {
        return { icon: icon }
      }
    }
  }
}
