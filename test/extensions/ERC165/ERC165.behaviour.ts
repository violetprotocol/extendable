import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { firstTokenId, secondTokenId } from "../base/ERC721.behaviour";
import { MODULE } from "../setup";

export function shouldBehaveLikeERC721Enumerable (module: MODULE) {
    context('with minted tokens', function () {
      beforeEach(async function () {
        await this.redeploy(module, false);
        await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
        await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, secondTokenId);
        this.toWhom = this.signers.other.address; // default to other for toWhom in context-dependent tests
      });
  
      describe('totalSupply', function () {
        it('returns total token supply', async function () {
          expect(await this.tokenAsEnumerableGetter.callStatic.totalSupply()).to.equal(BigNumber.from(2));
        });
      });
  
      describe('tokenOfOwnerByIndex', function () {
        describe('when the given index is lower than the amount of tokens owned by the given address', function () {
          it('returns the token ID placed at the given index', async function () {
            expect(await this.tokenAsEnumerableGetter.callStatic.tokenOfOwnerByIndex(this.signers.owner.address, 0)).to.equal(firstTokenId);
          });
        });
  
        describe('when the index is greater than or equal to the total tokens owned by the given address', function () {
          it('reverts', async function () {
            await expect(
              this.tokenAsEnumerableGetter.tokenOfOwnerByIndex(this.signers.owner.address, 2))
                .to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
          });
        });
  
        describe('when the given address does not own any token', function () {
          it('reverts', async function () {
            await expect(
              this.tokenAsEnumerableGetter.tokenOfOwnerByIndex(this.signers.other.address, 0))
                .to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
          });
        });
  
        describe('after transferring all tokens to another user', function () {
          beforeEach(async function () {
            await this.tokenAsTransfer.connect(this.signers.owner).transferFrom(this.signers.owner.address, this.signers.other.address, firstTokenId);
            await this.tokenAsTransfer.connect(this.signers.owner).transferFrom(this.signers.owner.address, this.signers.other.address, secondTokenId);
          });
  
          it('returns correct token IDs for target', async function () {
            expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.other.address)).to.equal(BigNumber.from(2));
            const tokensListed = await Promise.all(
              [0, 1].map(i => this.tokenAsEnumerableGetter.callStatic.tokenOfOwnerByIndex(this.signers.other.address, i)),
            );
            expect(tokensListed.map(t => t.toNumber())).to.have.members([firstTokenId.toNumber(),
              secondTokenId.toNumber()]);
          });
  
          it('returns empty collection for original owner', async function () {
            expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(0));
            await expect(
              this.tokenAsEnumerableGetter.tokenOfOwnerByIndex(this.signers.owner.address, 0))
                .to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
          });
        });
      });
  
      describe('tokenByIndex', function () {
        it('returns all tokens', async function () {
          const tokensListed = await Promise.all(
            [0, 1].map(i => this.tokenAsEnumerableGetter.callStatic.tokenByIndex(i)),
          );
          expect(tokensListed.map(t => t.toNumber())).to.have.members([firstTokenId.toNumber(),
            secondTokenId.toNumber()]);
        });
  
        it('reverts if index is greater than supply', async function () {
          await expect(
            this.tokenAsEnumerableGetter.tokenByIndex(2)).to.be.revertedWith('ERC721Enumerable: global index out of bounds');
        });
  
        [firstTokenId, secondTokenId].forEach(function (tokenId) {
          it(`returns all tokens after burning token ${tokenId} and minting new tokens`, async function () {
            const newTokenId = BigNumber.from(300);
            const anotherNewTokenId = BigNumber.from(400);
  
            await this.tokenAsBurn.burn(tokenId);
            await this.tokenAsErc721MockExtension.mint(this.signers.newOwner.address, newTokenId);
            await this.tokenAsErc721MockExtension.mint(this.signers.newOwner.address, anotherNewTokenId);
  
            expect(await this.tokenAsEnumerableGetter.callStatic.totalSupply()).to.equal(BigNumber.from(3));
  
            const tokensListed = await Promise.all(
              [0, 1, 2].map(i => this.tokenAsEnumerableGetter.callStatic.tokenByIndex(i)),
            );
            const expectedTokens = [firstTokenId, secondTokenId, newTokenId, anotherNewTokenId].filter(
              x => (x !== tokenId),
            );
            expect(tokensListed.map(t => t.toNumber())).to.have.members(expectedTokens.map(t => t.toNumber()));
          });
        });
      });
    });
  
    describe('_mint(address, uint256)', function () {
     beforeEach(async function() {
        await this.redeploy(module, false);
     })

      it('reverts with a null destination address', async function () {
        await expect(
          this.tokenAsErc721MockExtension.mint(ethers.constants.AddressZero, firstTokenId)).to.be.revertedWith('ERC721: mint to the zero address');
      });
  
      context('with minted token', async function () {
        beforeEach(async function () {
          (this.receipt = await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId));
        });
  
        it('adjusts owner tokens by index', async function () {
          expect(await this.tokenAsEnumerableGetter.callStatic.tokenOfOwnerByIndex(this.signers.owner.address, 0)).to.equal(firstTokenId);
        });
  
        it('adjusts all tokens list', async function () {
          expect(await this.tokenAsEnumerableGetter.callStatic.tokenByIndex(0)).to.equal(firstTokenId);
        });
      });
    });
  
    describe('_burn', function () {
     beforeEach(async function() {
        await this.redeploy(module, false);
     })

      it('reverts when burning a non-existent token id', async function () {
        await expect(
          this.tokenAsBurn.burn(firstTokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token');
      });
  
      context('with minted tokens', function () {
        beforeEach(async function () {
          await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
          await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, secondTokenId);
        });
  
        context('with burnt token', function () {
          beforeEach(async function () {
            (this.receipt = await this.tokenAsBurn.burn(firstTokenId));
          });
  
          it('removes that token from the token list of the owner', async function () {
            expect(await this.tokenAsEnumerableGetter.callStatic.tokenOfOwnerByIndex(this.signers.owner.address, 0)).to.equal(secondTokenId);
          });
  
          it('adjusts all tokens list', async function () {
            expect(await this.tokenAsEnumerableGetter.callStatic.tokenByIndex(0)).to.equal(secondTokenId);
          });
  
          it('burns all tokens', async function () {
            await this.tokenAsBurn.connect(this.signers.owner).burn(secondTokenId);
            expect(await this.tokenAsEnumerableGetter.callStatic.totalSupply()).to.equal(BigNumber.from(0));
            await expect(
              this.tokenAsEnumerableGetter.tokenByIndex(0)).to.be.revertedWith('ERC721Enumerable: global index out of bounds');
          });
        });
      });
    });
  }