import { Dimensions, ViewToken } from "react-native";
import { Item } from "../services/mockData";
import { useState, useCallback } from "react";
import Video from "./Video";
import { useCustomModalBackHandler } from "@/hook/useCustomBottomSheetModal";
import { FlashList } from "@shopify/flash-list";
import CustomBottomSheedModal from "./CustomBottomSheetModal";
import React from "react";
import ModalComments from "./ModalComments";
import ModalSharing from "./ModalSharing";
import ModalOptions from "./ModalOptions";

type VerticalListProps = {
  data: Item[];
};
const { height } = Dimensions.get("window");
const ITEM_SIZE = height;

const VerticalCarousel = ({ data }: VerticalListProps) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<Item | null>(null);

  const {
    bottomSheetModalRef: bottomSheetModalRefComments,
    openModal: openModalComments,
  } = useCustomModalBackHandler();
  const {
    bottomSheetModalRef: bottomSheetModalRefSharing,
    openModal: openModalSharing,
  } = useCustomModalBackHandler();
  const {
    bottomSheetModalRef: bottomSheetModalRefOptions,
    openModal: openModalOptions,
  } = useCustomModalBackHandler();

  const handleOpenComments = (video: Item) => {
    setCurrentVideo(video);
    openModalComments();
  };

  const handleOpenSharing = (video: Item) => {
    setCurrentVideo(video);
    openModalSharing();
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisibleIndex = viewableItems[0]?.index ?? 0;
      console.log("firstVisibleIndex", firstVisibleIndex);
      setVisibleIndex(firstVisibleIndex);
    },
    []
  );

  return (
    <>
      <FlashList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => (
          <Video
            item={item}
            shouldPlay={index === visibleIndex}
            openModalComments={() => handleOpenComments(item)}
            openModalSharing={() => handleOpenSharing(item)}
            openModalOptions={() => openModalOptions()}
          />
        )}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        estimatedItemSize={ITEM_SIZE}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 30,
        }}
      />
      <CustomBottomSheedModal ref={bottomSheetModalRefComments}>
        <ModalComments comments={currentVideo?.comments || []} />
      </CustomBottomSheedModal>
      <CustomBottomSheedModal ref={bottomSheetModalRefSharing}>
        <ModalSharing friends={currentVideo?.friends || []} />
      </CustomBottomSheedModal>
      <CustomBottomSheedModal ref={bottomSheetModalRefOptions} isDynamic={true}>
        <ModalOptions />
      </CustomBottomSheedModal>
    </>
  );
};

export default VerticalCarousel;
