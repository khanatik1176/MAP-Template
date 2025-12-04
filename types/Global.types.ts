export type BreadcrumbWithAvatarProps = {
    initialData: string;
    initialLink: string;
    secondaryData?: string;
    secondaryLink?: string;
    userData?: {
        name: string;
        email: string;
        avatarUrl: string;
    };
};

export type AvatarMenuProps = 
{
    userData?: any
}

export type PingDotProps = {
  color: string;
}

export type NotificationProps = {
    notifications: any[];
    onClose?: () => void;
    className?: string;
    };

export type viewToggleProps = {
    viewType: 'card' | 'table';
    setViewType: (viewType: 'card' | 'table') => void;
};

export type IHeadingProps = {
    isHome?: boolean;
    userData?: any;
    title?: string;
    subTitle?: string;
    titleclassName?: string;
    subTitleClassName?: string;
    className?: string;
};
