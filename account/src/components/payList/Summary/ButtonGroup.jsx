function ButtonGroup() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // modal control
  const handleModal = () => setIsModalOpen(!isModalOpen);

  const optionButtons = () => {
    const isDisabled = checkedItems.length === 0;
    return [
      { label: "선택삭제", disabled: isDisabled, onClick: handleDelete },
      { label: "선택복사", disabled: isDisabled, onClick: handleCopy },
      {
        label: "카드선택",
        disabled: isDisabled,
        onClick: () => handleOverlay("card-overlay"),
        hasOverlay: true,
      },
      { label: "고정금액", onClick: handleModal },
    ];
  };

  // 삭제
  const handleDelete = () => {
    const delCheckedIds = new Set(checkedItems);
    const payListIds = new Set(
      payList.filter((item) => delCheckedIds.has(item.id))
    );

    if (delCheckedIds.size > 0) {
      dispatch(deleteData([...delCheckedIds]));
    }

    setTempData((prevData) =>
      prevData.filter((item) => !delCheckedIds.has(item.id))
    );
    setCheckedItems([]);
  };

  // 데이터 복사
  const handleCopy = () => {
    const copyCheckedList = tempData
      .filter((item) => checkedItems.includes(item.id))
      .map((item) => ({ ...item, isNew: true }));
    copyCheckedList.map((item) => {
      setTempId((prevTempId) => {
        item.id = `${date}-${prevTempId}`;
        return prevTempId + 1;
      });
    });
    setTempData([
      ...tempData.slice(0, tempData.length - 1),
      ...copyCheckedList,
      ...tempData.slice(-1),
    ]);
    setCheckedItems([]);
  };

  const handleOverlay = (overlay) => {
    visibleOverlay === null
      ? setVisibleOverlay(overlay)
      : setVisibleOverlay(null);
  };

  return (
    <div className="button-group">
      {optionButtons().map((btn, index) =>
        btn.hasOverlay ? (
          <div key={index} className="popover-wrapper">
            <OptionButton disabled={btn.disabled} onClick={btn.onClick}>
              {btn.label}
            </OptionButton>
            {btn.hasOverlay && visibleOverlay === "card-overlay" && (
              <CardSelectOverlay
                cardList={cardList}
                changeSelectedCards={changeSelectedCards}
              />
            )}
          </div>
        ) : (
          <OptionButton
            key={index}
            disabled={btn.disabled}
            onClick={btn.onClick}
          >
            {btn.label}
          </OptionButton>
        )
      )}
      <PayListModal show={isModalOpen} onClose={handleModal} />
    </div>
  );
}

export default ButtonGroup;
