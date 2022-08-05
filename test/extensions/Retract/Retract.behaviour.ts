import { expect } from "chai";
import { EXTEND, REPLACE, RETRACT } from "../../utils/constants";

export function shouldBehaveLikeRetract() {
  it("extend should succeed", async function () {
    await expect(this.retractCaller.callExtend(this.extend.address)).to.not.be.reverted;
    expect(await this.retractCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.interface]);
    expect(await this.retractCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.selectors);
    expect(await this.retractCaller.callStatic.getExtensionAddresses()).to.deep.equal([this.extend.address]);
  });

  it("extend with retract should succeed", async function () {
    await expect(this.retractCaller.callExtend(this.retract.address)).to.not.be.reverted;
    expect(await this.retractCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
      EXTEND.interface,
      RETRACT.interface,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
      ...EXTEND.selectors,
      ...RETRACT.selectors,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionAddresses()).to.deep.equal([
      this.extend.address,
      this.retract.address,
    ]);
  });

  it("extend with replace should succeed", async function () {
    await expect(this.retractCaller.callExtend(this.replace.address)).to.not.be.reverted;
    expect(await this.retractCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
      EXTEND.interface,
      RETRACT.interface,
      REPLACE.interface,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
      ...EXTEND.selectors,
      ...RETRACT.selectors,
      ...REPLACE.selectors,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionAddresses()).to.deep.equal([
      this.extend.address,
      this.retract.address,
      this.replace.address,
    ]);
  });

  it("retract should fail with non-owner caller", async function () {
    await expect(this.retractCaller.connect(this.signers.user).callRetract(this.extend.address)).to.be.revertedWith(
      "unauthorised",
    );
    expect(await this.retractCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
      EXTEND.interface,
      RETRACT.interface,
      REPLACE.interface,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
      ...EXTEND.selectors,
      ...RETRACT.selectors,
      ...REPLACE.selectors,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionAddresses()).to.deep.equal([
      this.extend.address,
      this.retract.address,
      this.replace.address,
    ]);
  });

  it("retract with non-existent extension should fail", async function () {
    await expect(this.retractCaller.callRetract(this.signers.admin.address)).to.be.revertedWith(
      "Retract: specified extension is not an extension of this contract, cannot retract",
    );
    expect(await this.retractCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
      EXTEND.interface,
      RETRACT.interface,
      REPLACE.interface,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
      ...EXTEND.selectors,
      ...RETRACT.selectors,
      ...REPLACE.selectors,
    ]);
    expect(await this.retractCaller.callStatic.getExtensionAddresses()).to.deep.equal([
      this.extend.address,
      this.retract.address,
      this.replace.address,
    ]);
  });

  it("retract should succeed", async function () {
    await expect(this.retractCaller.callRetract(this.extend.address)).to.not.be.reverted;
    expect(await this.retractCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
      REPLACE.interface,
      RETRACT.interface,
    ]);
  });
}
